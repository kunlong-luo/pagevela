# Pagevela 自定义 UI 组件开发规范 / Branded UI Contract

> **硬性要求 / Blocking rule:** Pagevela 的用户可见交互必须使用统一的项目设计系统。**不要在功能开发中直接展示浏览器或操作系统的默认 UI 组件。** All user-facing interactions must use the Pagevela design system, not browser-default UI chrome.

## 开发前 / Before implementation

1. **先查复用 / Reuse before creating.** Check `src/components/ui/` and existing feature components before implementing an interaction. Reuse or extend the shared component instead of introducing another visual variation.
2. **入口正确 / Preserve intended placement.** Put an action at the location specified by the product requirement. Do not move an action into a similar-looking area merely because that area has another Start button.
3. **禁用默认弹出 UI / No browser-native popups.** Never present browser-native `title` tooltips, `alert()`, `confirm()`, `prompt()`, `<dialog>`, native popovers, `<select>`, `<datalist>`, `<details>` or default date, time, color, range, checkbox, or radio controls.
4. **统一滚动条 / Branded scrolling.** Every intentional scrollable UI surface must use the appropriate established capsule or hidden scrollbar utility, while preserving keyboard, pointer and touch scrolling.
5. **无障碍不退化 / Keep semantics and accessibility.** Use semantic HTML **inside** custom, styled components where necessary. Keep keyboard navigation, focus states, descriptive names, touch targets, focus management and screen-reader roles. Do not replace accessible controls with unlabeled decorative `div` elements.
6. **全场景验收 / Verify all supported contexts.** Test desktop, tablet and mobile widths; Chinese and English; light and dark themes; and keyboard/touch as appropriate. Check that popups are not clipped, controls remain clickable, and overlays cannot intercept unrelated actions.
7. **禁止绕过约束 / Never hide regressions.** Do not delete tests, weaken assertions, or use exceptions simply to allow native controls. Any genuine platform-required exception must be documented, visually hidden or wrapped, and separately reviewed.

## 组件对应关系 / Use these components

| Need | Required Pagevela approach |
| --- | --- |
| Tooltip / hint | `src/components/ui/Tooltip.tsx`, not the HTML `title` attribute |
| Select / dropdown | `CustomSelect` or an existing branded menu, not `<select>` |
| Confirm / alert | `useConfirm` + `CustomConfirmModal` or a project dialog, not `window.confirm/alert/prompt` |
| Checkbox / switch | `CustomCheckbox` / `CustomSwitch`, not a visible native checkbox or radio |
| Slider | `CustomSlider`, not `input type="range"` |
| Color | `CustomColorPicker` with Pagevela presets/HEX, not `input type="color"` |
| Date / month | Existing branded month/date picker, not native date/time input |
| Input / textarea | Use shared `CustomInput` / `CustomTextarea` where appropriate; preserve text editing accessibility |
| Scroll area | `workspace-scrollbar`, `scrollbar-capsule`, `scrollbar-thin` or deliberate `scrollbar-none` |
| Menu / popover | Branded and keyboard-accessible React component, not native popover chrome |

### 底层平台能力 / Underlying platform semantics

The restriction concerns **visible native widgets and default platform chrome**, not the HTML platform itself. Semantic buttons, links, ordinary text entry, focus handling and hidden file inputs may be used as implementation primitives. A user-initiated file-system picker and browser print/PDF dialog are unavoidable platform services; **their triggering controls in Pagevela must still be custom-designed**. Do not turn off native accessibility or keyboard behavior to achieve a custom look.

## 合并门槛 / Merge checklist

- Run `pnpm test` (includes `src/tests/no-native-ui.test.ts` and `no-native-select.test.ts`), `pnpm lint` and `pnpm build`.
- Run the affected E2E tests and inspect actual UI geometry and clickability, not only DOM presence.
- Verify a new user-facing component against this contract **before** PR approval.
- A source-level scanner cannot prove visual parity, so review any new third-party UI dependency and the rendered behavior separately.

This is a project-wide, persistent development rule, not a one-off fix for the Help or QR pages.
