## Goal
Aapki email `abhishek.kumar.chy21@itbhu.ac.in` ko admin banana, taaki same account se aap normal user (PDF reader, quizzes, SSC, etc.) bhi use kar sako **aur** `/admin` dashboard bhi access kar sako.

## Approach
Currently `public.is_admin()` me hardcoded `'admin@example.com'` hai. Bas us string ko aapki email se replace karna hai — koi schema change nahi, koi naya table nahi.

Admin status sirf `/admin/*` routes par `AdminRoute` guard check karta hai. Baki app me yeh function call hi nahi hota, isliye aapka regular usage (PDF reader, quizzes, SSC vocab, daily quiz, etc.) bilkul same rahega — same login, same data.

## What the migration does
- `public.is_admin()` ko update karta hai: ab `true` return karega jab logged-in user ki email `abhishek.kumar.chy21@itbhu.ac.in` ho.
- Function signature, security definer, search_path — sab same rakhe jaayenge (RLS policies jo `is_admin()` use karti hain wo as-is kaam karti rahengi).

## SQL that will run

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT (auth.jwt() ->> 'email') = 'abhishek.kumar.chy21@itbhu.ac.in'),
    false
  );
$$;
```

## After it runs
1. Agar abhi logged-in ho to ek baar **logout → login** karna (JWT refresh ho jaaye email claim ke saath).
2. `/admin` open karo — dashboard khulega.
3. `/admin/books` → book + topics + subtopics banao.
4. `/admin/upload` → PDF drop, extract, save.
5. Normal usage (PDF reader, `/ssc`, `/quiz/daily`, etc.) wahi same account se chalu rahega — admin hone se kuch break nahi hoga.

## Future (optional, nahi karna abhi)
Agar kabhi multiple admins chahiye to alag `user_roles` table + `has_role()` pattern me migrate kar sakte hain. Abhi single-admin email check is simplest aur safest.
