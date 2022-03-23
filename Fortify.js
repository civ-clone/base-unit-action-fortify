"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Fortify_unitImprovementRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fortify = void 0;
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const Fortified_1 = require("./Rules/Fortified");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const UnitImprovements_1 = require("@civ-clone/base-unit-improvement-fortified/UnitImprovements");
const Fortifying_1 = require("./Rules/Fortifying");
class Fortify extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        _Fortify_unitImprovementRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _Fortify_unitImprovementRegistry, unitImprovementRegistry, "f");
    }
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.MovementCost, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            this.unit().moves().set(0);
            this.unit().setActive(false);
            this.unit().setBusy(new Fortified_1.default(new Criterion_1.default(() => false)));
            __classPrivateFieldGet(this, _Fortify_unitImprovementRegistry, "f").register(new UnitImprovements_1.Fortified(this.unit()));
        }, Fortifying_1.default);
        this.ruleRegistry().process(Moved_1.Moved, this.unit(), this);
    }
}
exports.Fortify = Fortify;
_Fortify_unitImprovementRegistry = new WeakMap();
exports.default = Fortify;
//# sourceMappingURL=Fortify.js.map