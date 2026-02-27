

# Exam CRUD UI + Password Reset Flow + Fix Profile Trigger

## Issues Found

1. **Database trigger missing**: The `handle_new_user` trigger doesn't exist in the database despite the function being there. This means profile rows aren't created on signup, which could cause auth issues.
2. **No edit/delete UI for exams**: The store has `updateExam` and `deleteExam` but the sidebar only shows exam names with no way to edit or delete them.
3. **No password reset flow**: No forgot password link on the auth page, no `/reset-password` route.

## Plan

### 1. Fix profile trigger (Database migration)
```sql
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Add exam context menu in Sidebar
- Add a right-click context menu (or three-dot `MoreHorizontal` icon) on each exam item in the sidebar
- Options: **Edit** (opens edit dialog), **Delete** (confirmation alert dialog)
- Edit dialog: reuse similar UI to `CreateExamDialog` but pre-filled with current values, calls `updateExam`
- Delete: alert dialog with confirmation, calls `deleteExam`

### 3. Add password reset flow to Auth page
- Add "Forgot password?" link below the password field on login mode
- Clicking it shows email input + "Send Reset Link" button
- Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`

### 4. Create `/reset-password` page
- New file: `src/pages/ResetPassword.tsx`
- Checks for `type=recovery` in URL hash
- Shows new password form
- Calls `supabase.auth.updateUser({ password })`
- Add route in `App.tsx`: `<Route path="/reset-password" element={<ResetPassword />} />`

## Files to Modify/Create

| File | Changes |
|------|---------|
| Database migration | Recreate the `on_auth_user_created` trigger |
| `src/components/Sidebar.tsx` | Add edit/delete context menu for exams |
| `src/pages/Auth.tsx` | Add "Forgot password?" link and reset email flow |
| `src/pages/ResetPassword.tsx` | New — password reset form |
| `src/App.tsx` | Add `/reset-password` route |

