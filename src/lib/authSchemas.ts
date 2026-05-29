import { z } from "zod";

/** Mirrors backend `register_view` / `login_view` email validation. */
export const BACKEND_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PASSWORD_SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

export function getPasswordChecks(password: string) {
  return [
    { label: "Tối thiểu 6 ký tự", passed: password.length >= 6 },
    { label: "Có ít nhất 1 chữ viết hoa", passed: /[A-Z]/.test(password) },
    { label: "Có chữ và số", passed: /[A-Za-z]/.test(password) && /\d/.test(password) },
    { label: "Có 1 ký tự đặc biệt", passed: PASSWORD_SPECIAL_CHAR_REGEX.test(password) },
  ] as const;
}

function passwordMeetsRegisterRules(password: string): boolean {
  return getPasswordChecks(password).every((rule) => rule.passed);
}

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email.")
    .regex(BACKEND_EMAIL_REGEX, "Email không đúng định dạng mà server chấp nhận."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export const registerFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Vui lòng nhập họ tên.").max(200, "Họ tên quá dài."),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập email.")
      .regex(BACKEND_EMAIL_REGEX, "Email không đúng định dạng mà server chấp nhận."),
    username: z
      .string()
      .trim()
      .min(3, "Tên đăng nhập tối thiểu 3 ký tự.")
      .max(150, "Tên đăng nhập quá dài.")
      .regex(/^[a-zA-Z0-9._-]+$/, "Tên đăng nhập chỉ gồm chữ, số, . _ -"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự (yêu cầu server)."),
    password2: z.string().min(1, "Vui lòng nhập lại mật khẩu."),
    acceptedTerms: z.boolean(),
    role: z.enum(["student", "professor"]),
  })
  .superRefine((val, ctx) => {
    if (!passwordMeetsRegisterRules(val.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu chưa đạt đủ tất cả quy tắc bên dưới.",
        path: ["password"],
      });
    }
    if (val.password !== val.password2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hai mật khẩu không trùng nhau.",
        path: ["password2"],
      });
    }
    if (!val.acceptedTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bạn cần đồng ý điều khoản để tiếp tục.",
        path: ["terms"],
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function zodIssuesToFieldErrors(error: z.ZodError): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && map[key] === undefined) {
      map[key] = issue.message;
    }
  }
  return map;
}
