import { makeLoader, registerAll } from "./helpers";

// ⬇ Keep the exported names exactly as before
export const loadButton    = makeLoader("../atoms/AppButton.jsx",    "AppButton");
export const InputText     = makeLoader("../atoms/InputText.jsx",    "InputText");
export const InputNumber   = makeLoader("../atoms/InputNumber.jsx",  "InputNumber");
export const TextArea      = makeLoader("../atoms/TextArea.jsx",     "TextArea");
export const Checkbox      = makeLoader("../atoms/Checkbox.jsx",     "Checkbox");       // if you have it
export const RadioGroup    = makeLoader("../atoms/RadioGroup.jsx",   "RadioGroup");
export const DatePicker    = makeLoader("../atoms/DatePicker.jsx",   "DatePicker");
export const Label         = makeLoader("../atoms/Label.jsx",        "Label");
export const HelperText    = makeLoader("../atoms/HelperText.jsx",   "HelperText");
export const ErrorMessage  = makeLoader("../atoms/ErrorMessage.jsx", "ErrorMessage");
export const FieldWrapper  = makeLoader("../atoms/FieldWrapper.jsx", "FieldWrapper");
export const TextFieldAtom = makeLoader("../atoms/TextFieldAtom.jsx","TextFieldAtom");
export const IconSlot      = makeLoader("../atoms/IconSlot.jsx",     "IconSlot");
export const TypographyX   = makeLoader("../atoms/TypographyX.jsx",  "TypographyX");


const defs = [
  ["AppButton",     loadButton],
  ["InputText",     InputText],
  ["InputNumber",   InputNumber],
  ["TextArea",      TextArea],
  ["Checkbox",      Checkbox],
  ["RadioGroup",    RadioGroup],
  ["DatePicker",    DatePicker],
  ["Label",         Label],
  ["HelperText",    HelperText],
  ["ErrorMessage",  ErrorMessage],
  ["FieldWrapper",  FieldWrapper],
  ["TextFieldAtom", TextFieldAtom],
  ["IconSlot",      IconSlot],
  ["TypographyX",   TypographyX],
];

export const registerAtoms = () => registerAll(defs);
