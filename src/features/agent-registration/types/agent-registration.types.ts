export interface Province {
  id: number;
  is_active: boolean;
  name: string;
  code: string;
  name_split: string;
  creator_user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
  country: number;
}

export interface City {
  id: number;
  is_active: boolean;
  name: string;
  fanavaran_code: string;
  name_split: string;
  province: {
    id: number;
    is_active: boolean;
    name: string;
    code: string;
    name_split: string;
    creator_user: number;
    country: number;
  };
  creator_user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
}

export interface CheckAgencyCodeResponse {
  status_code: number;
  message: string;
  is_success: boolean;
  error_details?: {
    type: string;
    code: string;
    detail: string;
    attr: string;
    fa_details: string;
  };
  response: null;
}

export interface CheckAgencyCodeRequest {
  agent_code: string;
}

export interface InsuranceBranchResponse {
  status_code: number;
  message: string;
  is_success: true;
  error_details: null;
  response: {
    id: number;
    name: string;
    insurance: number;
    province: number;
    county: number;
  }[];
}

export interface RegisterAgentResponse {
  status_code: number;
  message: number;
  is_success: boolean;
  error_details: null;
  response: {
    refresh: string;
    access: string;
  };
}
export interface RegisterAgentRequest {
  address: string;
  agent_code: string;
  agency_type: string;
  city_code: string;
  county: string;
  first_name: string;
  insurance_branch: number;
  last_name: string;
  phone_number: string;
  phone: string;
  province: string;
  name: string;
}
