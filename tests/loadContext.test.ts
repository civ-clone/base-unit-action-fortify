import { COMPLETE } from '../Fortify';
import Fortified from '@civ-clone/base-unit-improvement-fortified/UnitImprovements/Fortified';
import Generator from '@civ-clone/core-world-generator/Generator';
import PendingEffect from '@civ-clone/core-pending-effect/PendingEffect';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import { instance as busyRegistryInstance } from '@civ-clone/core-unit/BusyRegistry';
import { instance as unitImprovementRegistryInstance } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';

// civ-clone/web-renderer#248
describe('Fortify, loaded into a game with its own registries', (): void => {
  it("completes into the context's `unitImprovements`, not the module instance", (): void => {
    const context = {
        pendingEffects: new PendingEffectRegistry(),
        rules: new RuleRegistry(),
        turn: new Turn(),
        unitImprovements: new UnitImprovementRegistry(),
      },
      tile = new Tile(0, 0, new Terrain(), new World(new Generator(1, 1))),
      unit = new Unit(null, new Player(), tile, context.rules);

    context.pendingEffects.register(
      new PendingEffect(COMPLETE, unit, { endTurn: '1' })
    );
    context.turn.set(1);

    const busy = busyRegistryInstance.rebuild('Fortifying', unit, context);

    busy.process();

    expect(
      context.unitImprovements
        .getByUnit(unit)
        .some((improvement) => improvement instanceof Fortified)
    ).to.true;
    expect(unitImprovementRegistryInstance.getByUnit(unit)).to.have.length(0);
  });
});
