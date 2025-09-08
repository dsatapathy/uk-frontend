// --- perf helpers ---
const makePerfFields = (count = 100) =>
  Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const isNumber = n % 10 === 0; // every 10th field is a number
    return {
      id: `perf_${String(n).padStart(3, "0")}`,
      type: isNumber ? "number" : "text",
      label: `Perf Field ${n}`,
      props: isNumber
        ? { min: 0, step: 1, inputMode: "numeric" }
        : { maxLength: 80, placeholder: `Value ${n}` },
      // keep validations light to minimize watchers
      validations: n % 7 === 0 ? [{ type: "required" }] : [],
      // 1-col on phones, 2-col on small screens, 3-col on md+
      grid: { span: { xs: 12, sm: 6, md: 4 } },
    };
  });

const PERF_100_SECTION = {
  id: "perf-100",
  title: "Performance 50",
  fields: makePerfFields(50),
};
export const bpaSchema = {
  $schema: "fe.v1",
  id: "bpa-apply",
  version: "1.0.0",
  title: "Building Plan Approval – Application",
  sections: [
    PERF_100_SECTION
  ]
};
