import { describe, expect, it } from "vitest";
import { err, isErr, isOk, ok, unwrap } from "./result";

describe("Result", () => {
  it("แยกฝั่งสำเร็จกับฝั่งล้มเหลวออกจากกันได้", () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isErr(err("ไม่ผ่าน"))).toBe(true);
  });

  it("unwrap คืนค่าเมื่อสำเร็จ และโยนเมื่อล้มเหลว", () => {
    expect(unwrap(ok(1))).toBe(1);
    expect(() => unwrap(err("ไม่ผ่าน"))).toThrow();
  });
});
