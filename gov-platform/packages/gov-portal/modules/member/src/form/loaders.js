import { loadConfig } from "@gov/ui";

export const loadMemberProfileSchema = () => loadConfig("member/forms/member-profile.schema");
export const loadMemberProfileSteps = () => loadConfig("member/forms/member-profile.steps");
export const loadShgRegistrationSchema = () => loadConfig("member/forms/shg-registration.schema");
export const loadUpdateProfileSchema = () => loadConfig("member/forms/update-profile.schema");
export const loadUpdateProfileSteps = () => loadConfig("member/forms/update-profile.steps");
export const loadVoRegistrationSchema = () => loadConfig("member/forms/vo-registration.schema");
