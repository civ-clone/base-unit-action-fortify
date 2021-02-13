"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _unitImprovementRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fortify = void 0;
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const Busy_1 = require("@civ-clone/core-unit/Rules/Busy");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const UnitImprovements_1 = require("@civ-clone/base-unit-improvement-fortified/UnitImprovements");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
class Fortify extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        _unitImprovementRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _unitImprovementRegistry, unitImprovementRegistry);
    }
    perform() {
        const [moveCost,] = this.ruleRegistry()
            .process(MovementCost_1.MovementCost, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            this.unit().setBusy(new Busy_1.default(new Criterion_1.default(() => false)));
            __classPrivateFieldGet(this, _unitImprovementRegistry).register(new UnitImprovements_1.Fortified(this.unit()));
        });
        this.ruleRegistry().process(Moved_1.Moved, this.unit(), this);
    }
}
exports.Fortify = Fortify;
_unitImprovementRegistry = new WeakMap();
exports.default = Fortify;
//# sourceMappingURL=Fortify.js.map