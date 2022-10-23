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
import Fortified from '@civ-clone/base-unit-improvement-fortified/UnitImprovements/Fortified';
import Fortifying from './Rules/Fortifying';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import MovementCost from '@civ-clone/core-unit/Rules/MovementCost';
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
    const [moveCost]: number[] = this.ruleRegistry()
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

    this.ruleRegistry().process(Moved, this.unit(), this);
  }
}

export default Fortify;
