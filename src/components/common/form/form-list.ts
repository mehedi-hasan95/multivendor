export type AuthProps = {
  id: string;
  type?: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea";
  placeholder?: string;
  label?: string;
  name: string;
  rows?: number;
  options?: { value: string; label: string; id: string }[];
};

export const LOGIN_FORM: AuthProps[] = [
  {
    id: "1",
    type: "email",
    inputType: "input",
    placeholder: "me@me.com",
    label: "Email",
    name: "email",
  },
  {
    id: "2",
    type: "password",
    inputType: "input",
    placeholder: "*******",
    label: "Password",
    name: "password",
  },
];

export const REGISTER_FORM: AuthProps[] = [
  {
    id: "1",
    type: "text",
    inputType: "input",
    placeholder: "e.g. Mehedi",
    name: "name",
    label: "Your Name",
  },
  {
    id: "2",
    type: "text",
    inputType: "input",
    placeholder: "Hasan",
    label: "Username",
    name: "username",
  },
  {
    id: "3",
    inputType: "input",
    type: "email",
    placeholder: "me@me.com",
    label: "Email",
    name: "email",
  },
  {
    id: "5",
    inputType: "input",
    type: "password",
    placeholder: "***",
    label: "Password",
    name: "password",
  },
  {
    id: "6",
    inputType: "input",
    type: "password",
    placeholder: "***",
    label: "Confirm Password",
    name: "confirmPassword",
  },
];
