import { RuleModel } from './models';

const Rules = {};

Rules.rules = () => RuleModel.find();

Rules.createRule = async (rule) => {
  const savedRule = await new RuleModel(rule).save();
  return savedRule;
};

Rules.deleteRule = async (ruleId) => {
  const deletedRule = await RuleModel.findOneAndRemove({ id: ruleId });
  return deletedRule;
};

const sign = v => v < 0 ? -1 : v > 0 ? 1 : 0; // eslint-disable-line

Rules.match = async (measurement, type) => {
  const station = measurement[`${type}Station`];
  const filter = { $and: [] };
  filter.$and.push({ type });
  filter.$and.push({ $or: [{ port: [] }, { port: station.port.id }] });
  filter.$and.push({ $or: [{ station: [] }, { station: station.id }] });
  const rules = await RuleModel.find(filter);
  return rules.filter((rule) => {
    let match = false;
    if (measurement[rule.attribute]) {
      const comparison = sign(measurement[rule.attribute] - rule.value);
      match = ((rule.inclusive && comparison === 0) || sign(rule.comparison) === comparison);
    }
    return match;
  });
};

export default Rules;
