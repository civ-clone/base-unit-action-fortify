import { Moved, IMovedRegistry } from '@civ-clone/core-unit/Rules/Moved';
import {
  MovementCost,
  IMovementCostRegistry,
} from '@civ-clone/core-unit/Rules/MovementCost';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Busy from '@civ-clone/core-unit/Rules/Busy';
import Criterion from '@civ-clone/core-rule/Criterion';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import { Fortified } from '@civ-clone/base-unit-improvement-fortified/UnitImprovements';

export class Fortify extends DelayedAction {
  perform() {
    const [
      moveCost,
    ]: number[] = (this.ruleRegistry() as IMovementCostRegistry)
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(
      moveCost,
      (
        unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
      ): void => {
        this.unit().setBusy(new Busy(new Criterion(() => false)));

        unitImprovementRegistry.register(new Fortified(this.unit()));
      }
    );

    (this.ruleRegistry() as IMovedRegistry).process(Moved, this.unit(), this);
  }
}

export default Fortify;
