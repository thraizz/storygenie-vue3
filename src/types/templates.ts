export type Template = {
  name: string;
  description: string;
};

export type TemplateWithId = Template & {
  id: string;
};
