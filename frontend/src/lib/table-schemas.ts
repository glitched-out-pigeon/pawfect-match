export type FieldType = "text" | "number" | "boolean" | "textarea" | "fk" | "datetime" | "select" | "image";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  fkEndpoint?: string; // for type: fk
  fkLabelField?: string; // default 'name'
  options?: string[]; // for type: select
  hideInForm?: boolean; // e.g. id, created_at
}

export interface FilterDef {
  field: string;
  label: string;
  options?: string[];
  fromData?: boolean;
  fkEndpoint?: string; // resolve UUIDs against this endpoint, display names
}

export interface TableDef {
  key: string;
  label: string;
  endpoint: string;
  fields: FieldDef[];
  filters?: FilterDef[];
}

export const TABLES: Record<string, TableDef> = {
  animals: {
    key: "animals",
    label: "Animals",
    endpoint: "animals",
    fields: [
      { key: "id", label: "ID", type: "text", hideInForm: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "species", label: "Species", type: "text", required: true },
      { key: "breed", label: "Breed", type: "text" },
      { key: "age", label: "Age", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "is_adopted", label: "Adopted", type: "boolean" },
      { key: "created_at", label: "Created", type: "datetime", hideInForm: true },
    ],
    filters: [
      { field: "species", label: "Species", fromData: true },
      { field: "is_adopted", label: "Adopted", options: ["true", "false"] },
    ],
  },
  employees: {
    key: "employees",
    label: "Employees",
    endpoint: "employees",
    fields: [
      { key: "id", label: "ID", type: "text", hideInForm: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text", required: true },
      { key: "email", label: "Email", type: "text", required: true },
      { key: "phone", label: "Phone", type: "text" },
      { key: "hired_at", label: "Hired At", type: "datetime" },
    ],
    filters: [{ field: "role", label: "Role", fromData: true }],
  },
  adopters: {
    key: "adopters",
    label: "Adopters",
    endpoint: "adopters",
    fields: [
      { key: "id", label: "ID", type: "text", hideInForm: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "email", label: "Email", type: "text", required: true },
      { key: "phone", label: "Phone", type: "text" },
      { key: "animal_id", label: "Animal", type: "fk", fkEndpoint: "animals", required: true },
      { key: "processed_by", label: "Processed By", type: "fk", fkEndpoint: "employees" },
      { key: "adopted_at", label: "Adopted At", type: "datetime" },
    ],
    filters: [
      { field: "animal_id", label: "Animal", fkEndpoint: "animals" },
      { field: "processed_by", label: "Processed By", fkEndpoint: "employees" },
    ],
  },
  applications: {
    key: "applications",
    label: "Applications",
    endpoint: "applications",
    fields: [
      { key: "id", label: "ID", type: "text", hideInForm: true },
      { key: "applicant_name", label: "Applicant Name", type: "text", required: true },
      { key: "applicant_email", label: "Applicant Email", type: "text", required: true },
      { key: "applicant_phone", label: "Applicant Phone", type: "text" },
      { key: "animal_id", label: "Animal", type: "fk", fkEndpoint: "animals", required: true },
      { key: "status", label: "Status", type: "select", options: ["pending", "approved", "rejected"], required: true },
      { key: "reviewed_by", label: "Reviewed By", type: "fk", fkEndpoint: "employees" },
      { key: "applied_at", label: "Applied At", type: "datetime" },
    ],
    filters: [{ field: "status", label: "Status", options: ["pending", "approved", "rejected"] }],
  },
  "vet-records": {
    key: "vet-records",
    label: "Vet Records",
    endpoint: "vet-records",
    fields: [
      { key: "id", label: "ID", type: "text", hideInForm: true },
      { key: "animal_id", label: "Animal", type: "fk", fkEndpoint: "animals", required: true },
      { key: "employee_id", label: "Employee", type: "fk", fkEndpoint: "employees" },
      { key: "record_type", label: "Record Type", type: "text", required: true },
      { key: "notes", label: "Notes", type: "textarea" },
      { key: "recorded_at", label: "Recorded At", type: "datetime" },
    ],
    filters: [{ field: "record_type", label: "Record Type", fromData: true }],
  },
  "intake-records": {
    key: "intake-records",
    label: "Intake Records",
    endpoint: "intake-records",
    fields: [
      { key: "id", label: "ID", type: "text", hideInForm: true },
      { key: "animal_id", label: "Animal", type: "fk", fkEndpoint: "animals", required: true },
      { key: "intake_type", label: "Intake Type", type: "select", options: ["stray", "surrendered", "rescued", "transferred"], required: true },
      { key: "notes", label: "Notes", type: "textarea" },
      { key: "received_by", label: "Received By", type: "fk", fkEndpoint: "employees" },
      { key: "intake_date", label: "Intake Date", type: "datetime" },
    ],
    filters: [{ field: "intake_type", label: "Intake Type", options: ["stray", "surrendered", "rescued", "transferred"] }],
  },
  "rehoming-applications": {
    key: "rehoming-applications",
    label: "Rehoming Applications",
    endpoint: "rehoming",
    fields: [
      { key: "id", label: "ID", type: "text", hideInForm: true },
      { key: "owner_name", label: "Owner Name", type: "text", required: true },
      { key: "owner_email", label: "Owner Email", type: "text", required: true },
      { key: "owner_phone", label: "Owner Phone", type: "text" },
      { key: "animal_name", label: "Animal Name", type: "text", required: true },
      { key: "species", label: "Species", type: "text", required: true },
      { key: "breed", label: "Breed", type: "text" },
      { key: "age", label: "Age", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "reason_for_rehoming", label: "Reason", type: "textarea" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "status", label: "Status", type: "select", options: ["pending", "approved", "rejected"] },
      { key: "reviewed_by", label: "Reviewed By", type: "fk", fkEndpoint: "employees" },
      { key: "submitted_at", label: "Submitted At", type: "datetime", hideInForm: true },
    ],
    filters: [{ field: "status", label: "Status", options: ["pending", "approved", "rejected"] }],
  },
};
