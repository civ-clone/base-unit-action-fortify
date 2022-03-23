import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import { UnitImprovementRegistry } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
export declare class Fortify extends DelayedAction {
  #private;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry?: RuleRegistry,
    turn?: Turn,
    unitImprovementRegistry?: UnitImprovementRegistry
  );
  perform(): void;
}
export default Fortify;
