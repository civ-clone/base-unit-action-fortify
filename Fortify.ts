import { Moved, IMovedRegistry } from '@civ-clone/core-unit/Rules/Moved';
import {
  MovementCost,
  IMovementCostRegistry,
} from '@civ-clone/core-unit/Rules/MovementCost';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import BusyFortified from './Rules/Fortified';
import Criterion from '@civ-clone/core-rule/Criterion';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import { Fortified } from '@civ-clone/base-unit-improvement-fortified/UnitImprovements';
import Fortifying from './Rules/Fortifying';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

export class Fortify extends DelayedAction {
  #unitImprovementRegistry: UnitImprovementRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    turn: Turn = turnInstance,
    unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry, turn);

    this.#unitImprovementRegistry = unitImprovementRegistry;
  }

  perform() {
    const [moveCost]: number[] = (this.ruleRegistry() as IMovementCostRegistry)
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(
      moveCost,
      (): void => {
        this.unit().moves().set(0);
        this.unit().setActive(false);
        this.unit().setBusy(new BusyFortified(new Criterion(() => false)));

        this.#unitImprovementRegistry.register(new Fortified(this.unit()));
      },
      Fortifying
    );

    (this.ruleRegistry() as IMovedRegistry).process(Moved, this.unit(), this);
  }
}

export default Fortify;
