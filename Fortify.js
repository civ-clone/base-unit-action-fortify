"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fortify = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const Fortified_1 = require("./Rules/Fortified");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Fortified_2 = require("@civ-clone/base-unit-improvement-fortified/UnitImprovements/Fortified");
const Fortifying_1 = require("./Rules/Fortifying");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
class Fortify extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        this._unitImprovementRegistry = unitImprovementRegistry;
    }
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            this.unit().moves().set(0);
            this.unit().setActive(false);
            this.unit().setBusy(new Fortified_1.default(new Criterion_1.default(() => false)));
            this._unitImprovementRegistry.register(new Fortified_2.default(this.unit()));
        }, Fortifying_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.Fortify = Fortify;
exports.default = Fortify;
//# sourceMappingURL=Fortify.js.map