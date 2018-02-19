export interface IProject {
  tx: String;
  name: String;
  country: String;
  owner: {
    did: String;
  }
  about: String;
  agentTemplate: {
    name: String;
  },
  autoApproveInvestmentAgent: Boolean;
  autoApproveServiceAgent: Boolean;
  autoApproveEvaluationAgent: Boolean;
  numberOfSuccessfulClaims: Number;
  claimTemplate: {
    name: String;
  },
  evaluationTemplate: {
    name: String;
  },

}