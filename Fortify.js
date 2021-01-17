"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fortify = void 0;
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const Busy_1 = require("@civ-clone/core-unit/Rules/Busy");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const UnitImprovements_1 = require("@civ-clone/base-unit-improvement-fortified/UnitImprovements");
class Fortify extends DelayedAction_1.default {
    perform() {
        const [moveCost,] = this.ruleRegistry()
            .process(MovementCost_1.MovementCost, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, (unitImprovementRegistry = UnitImprovementRegistry_1.instance) => {
            this.unit().setBusy(new Busy_1.default(new Criterion_1.default(() => false)));
            unitImprovementRegistry.register(new UnitImprovements_1.Fortified(this.unit()));
        });
        this.ruleRegistry().process(Moved_1.Moved, this.unit(), this);
    }
}
exports.Fortify = Fortify;
exports.default = Fortify;
//# sourceMappingURL=Fortify.js.map