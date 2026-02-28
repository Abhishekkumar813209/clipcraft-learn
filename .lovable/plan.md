

# Empty Topic Dropdown - Not a Bug, Missing Data

## What's Happening
The "Select topic" dropdown is empty because no topics have been created under the "DSA" subject yet. The hierarchy is: **Exam → Subject → Topic → Sub-Topic**. You created the Exam ("Placement") and Subject ("DSA"), but haven't added any Topics or Sub-Topics under it.

The dropdown code is correct — it fetches topics from the nested store data. No topics in the database = empty dropdown.

## The Real Problem
There's no easy way to create topics/sub-topics from the video player page itself. You have to go back to the Dashboard, navigate into a subject, and manually create topics and sub-topics first — which is a bad workflow.

## Proposed Solution
Add inline "quick create" buttons inside the dropdowns so users can create topics and sub-topics on the fly while adding clips:

### Changes in `src/components/VideoPlayerView.tsx`
1. After the topic `SelectContent` items, add a "Create new topic" button that opens a small inline input
2. Same for sub-topic dropdown — add "Create new sub-topic" button
3. When user types a name and confirms, call `addTopic` / `addSubTopic` from the store and auto-select the newly created item

### Changes in `src/components/AddClipsView.tsx`
Same quick-create buttons in the AddClipDialog dropdowns for consistency.

### UI Pattern
Inside each `SelectContent`, after the existing items, add a separator and a button:
```
[Existing items...]
─────────────
+ Create new topic
```
Clicking it shows an inline input field + confirm button, creates the item, and selects it automatically.

This way users never have to leave the clip creation flow to set up their hierarchy.

