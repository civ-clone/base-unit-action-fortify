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
import registerDelayedAction from '@civ-clone/core-unit/registerDelayedAction';
import { instance as busyRegistryInstance } from '@civ-clone/core-unit/BusyRegistry';

export const COMPLETE = 'base-unit-action-fortify:complete';

export class Fortify extends DelayedAction {
  private _unitImprovementRegistry: UnitImprovementRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    turn: Turn = turnInstance,
    unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry, turn);

    this._unitImprovementRegistry = unitImprovementRegistry;
  }

  perform() {
    const [moveCost]: number[] = this.ruleRegistry()
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(moveCost, COMPLETE, Fortifying);

    this.ruleRegistry().process(Moved, this.unit(), this);
  }
}

// Fortifying is a delayed action that becomes a *permanent* busy state, so
// this package has both kinds of `Busy` rule and needs both registrations.
//
// `Fortifying` is the in-progress one, so it goes through
// `registerDelayedAction` like the eight build and clear actions: its
// completion used to be a closure passed to `perform`, which is what made a
// half-fortified unit unsaveable.
registerDelayedAction({
  BusyRule: Fortifying,
  handler: COMPLETE,
  action: (unit: Unit) => new Fortify(unit.tile(), unit.tile(), unit),
  complete: (unit: Unit) => {
    unit.moves().set(0);
    unit.setActive(false);
    unit.setBusy(new BusyFortified(new Criterion(() => false)));

    unitImprovementRegistryInstance.register(new Fortified(unit));
  },
});

// `Fortified` is the state it arrives at: permanent until something else
// changes it, so its criterion is `() => false` and there is nothing to
// schedule. A factory is all it needs — and the durable fact is saved anyway,
// as the `Fortified` `UnitImprovement` registered above.
busyRegistryInstance.register(
  BusyFortified,
  () => new BusyFortified(new Criterion(() => false))
);

export default Fortify;
