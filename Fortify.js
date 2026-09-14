"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fortify = exports.COMPLETE = void 0;
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
const registerDelayedAction_1 = require("@civ-clone/core-unit/registerDelayedAction");
const BusyRegistry_1 = require("@civ-clone/core-unit/BusyRegistry");
exports.COMPLETE = 'base-unit-action-fortify:complete';
class Fortify extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        this._unitImprovementRegistry = unitImprovementRegistry;
    }
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, exports.COMPLETE, Fortifying_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.Fortify = Fortify;
// Fortifying is a delayed action that becomes a *permanent* busy state, so
// this package has both kinds of `Busy` rule and needs both registrations.
//
// `Fortifying` is the in-progress one, so it goes through
// `registerDelayedAction` like the eight build and clear actions: its
// completion used to be a closure passed to `perform`, which is what made a
// half-fortified unit unsaveable.
(0, registerDelayedAction_1.default)({
    BusyRule: Fortifying_1.default,
    handler: exports.COMPLETE,
    action: (unit) => new Fortify(unit.tile(), unit.tile(), unit),
    complete: (unit) => {
        unit.moves().set(0);
        unit.setActive(false);
        unit.setBusy(new Fortified_1.default(new Criterion_1.default(() => false)));
        UnitImprovementRegistry_1.instance.register(new Fortified_2.default(unit));
    },
});
// `Fortified` is the state it arrives at: permanent until something else
// changes it, so its criterion is `() => false` and there is nothing to
// schedule. A factory is all it needs — and the durable fact is saved anyway,
// as the `Fortified` `UnitImprovement` registered above.
BusyRegistry_1.instance.register(Fortified_1.default, () => new Fortified_1.default(new Criterion_1.default(() => false)));
exports.default = Fortify;
//# sourceMappingURL=Fortify.js.map