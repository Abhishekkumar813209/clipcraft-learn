export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_books: {
        Row: {
          created_at: string
          description: string | null
          exam_tag: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          exam_tag: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          exam_tag?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_questions: {
        Row: {
          book_id: string
          correct_option: number
          created_at: string
          difficulty: string | null
          exam_tag: string
          explanation: string | null
          id: string
          options: Json
          question_text: string
          source_pdf_name: string | null
          subtopic_id: string | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          book_id: string
          correct_option: number
          created_at?: string
          difficulty?: string | null
          exam_tag: string
          explanation?: string | null
          id?: string
          options: Json
          question_text: string
          source_pdf_name?: string | null
          subtopic_id?: string | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          correct_option?: number
          created_at?: string
          difficulty?: string | null
          exam_tag?: string
          explanation?: string | null
          id?: string
          options?: Json
          question_text?: string
          source_pdf_name?: string | null
          subtopic_id?: string | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_questions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "admin_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_questions_subtopic_id_fkey"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "admin_subtopics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "admin_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_study_log: {
        Row: {
          id: string
          questions_attempted: number
          studied_at: string
          subtopic_id: string
          user_id: string
        }
        Insert: {
          id?: string
          questions_attempted?: number
          studied_at?: string
          subtopic_id: string
          user_id: string
        }
        Update: {
          id?: string
          questions_attempted?: number
          studied_at?: string
          subtopic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_study_log_subtopic_id_fkey"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "admin_subtopics"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_subtopics: {
        Row: {
          created_at: string
          id: string
          name: string
          order_index: number
          topic_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_index?: number
          topic_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_subtopics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "admin_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_topics: {
        Row: {
          book_id: string
          created_at: string
          id: string
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_topics_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "admin_books"
            referencedColumns: ["id"]
          },
        ]
      }
      bb_practice_attempts: {
        Row: {
          category: string
          correct_index: number
          created_at: string
          id: string
          is_correct: boolean
          item_id: string | null
          options: Json
          picked_index: number | null
          question: string
          session_id: string
          user_id: string
        }
        Insert: {
          category: string
          correct_index: number
          created_at?: string
          id?: string
          is_correct?: boolean
          item_id?: string | null
          options: Json
          picked_index?: number | null
          question: string
          session_id: string
          user_id: string
        }
        Update: {
          category?: string
          correct_index?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          item_id?: string | null
          options?: Json
          picked_index?: number | null
          question?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bb_practice_attempts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "ssc_black_book_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bb_practice_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "bb_practice_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      bb_practice_sessions: {
        Row: {
          category: string
          correct: number
          created_at: string
          id: string
          total: number
          user_id: string
        }
        Insert: {
          category: string
          correct?: number
          created_at?: string
          id?: string
          total?: number
          user_id: string
        }
        Update: {
          category?: string
          correct?: number
          created_at?: string
          id?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      black_book_daily_progress: {
        Row: {
          attempted: number
          category: string
          correct: number
          date: string
          id: string
          target: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempted?: number
          category: string
          correct?: number
          date?: string
          id?: string
          target?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempted?: number
          category?: string
          correct?: number
          date?: string
          id?: string
          target?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bpsc_mains_questions: {
        Row: {
          created_at: string
          difficulty: Database["public"]["Enums"]["ssc_difficulty"]
          id: string
          is_pyq: boolean
          marks: number
          model_answer: string | null
          paper: Database["public"]["Enums"]["bpsc_mains_paper"]
          question_text: string
          topic: string
          word_limit: number | null
          year: number | null
        }
        Insert: {
          created_at?: string
          difficulty?: Database["public"]["Enums"]["ssc_difficulty"]
          id?: string
          is_pyq?: boolean
          marks?: number
          model_answer?: string | null
          paper: Database["public"]["Enums"]["bpsc_mains_paper"]
          question_text: string
          topic: string
          word_limit?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string
          difficulty?: Database["public"]["Enums"]["ssc_difficulty"]
          id?: string
          is_pyq?: boolean
          marks?: number
          model_answer?: string | null
          paper?: Database["public"]["Enums"]["bpsc_mains_paper"]
          question_text?: string
          topic?: string
          word_limit?: number | null
          year?: number | null
        }
        Relationships: []
      }
      bpsc_mains_user_answers: {
        Row: {
          ai_feedback: string | null
          ai_score: number | null
          answer_text: string
          id: string
          question_id: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          ai_feedback?: string | null
          ai_score?: number | null
          answer_text: string
          id?: string
          question_id: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          ai_feedback?: string | null
          ai_score?: number | null
          answer_text?: string
          id?: string
          question_id?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bpsc_mains_user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "bpsc_mains_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      clips: {
        Row: {
          created_at: string | null
          end_time: number
          id: string
          is_primary: boolean | null
          label: string | null
          notes: string | null
          order: number | null
          start_time: number
          sub_topic_id: string
          updated_at: string | null
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          end_time: number
          id?: string
          is_primary?: boolean | null
          label?: string | null
          notes?: string | null
          order?: number | null
          start_time: number
          sub_topic_id: string
          updated_at?: string | null
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: number
          id?: string
          is_primary?: boolean | null
          label?: string | null
          notes?: string | null
          order?: number | null
          start_time?: number
          sub_topic_id?: string
          updated_at?: string | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clips_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clips_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_clips: {
        Row: {
          created_at: string | null
          end_time: number
          id: string
          label: string | null
          start_time: number
          user_id: string
          video_youtube_id: string
        }
        Insert: {
          created_at?: string | null
          end_time: number
          id?: string
          label?: string | null
          start_time: number
          user_id: string
          video_youtube_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: number
          id?: string
          label?: string | null
          start_time?: number
          user_id?: string
          video_youtube_id?: string
        }
        Relationships: []
      }
      duel_answers: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          match_id: string
          ms_taken: number
          q_index: number
          selected: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct: boolean
          match_id: string
          ms_taken?: number
          q_index: number
          selected: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          match_id?: string
          ms_taken?: number
          q_index?: number
          selected?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duel_answers_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "duel_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      duel_matches: {
        Row: {
          category: string
          created_at: string
          ended_at: string | null
          guest_id: string | null
          host_id: string
          id: string
          question_ids: string[]
          seconds_per_q: number
          started_at: string | null
          status: string
          winner_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          ended_at?: string | null
          guest_id?: string | null
          host_id: string
          id?: string
          question_ids?: string[]
          seconds_per_q?: number
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          ended_at?: string | null
          guest_id?: string | null
          host_id?: string
          id?: string
          question_ids?: string[]
          seconds_per_q?: number
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_quiz_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_saved_quizzes: {
        Row: {
          ai_feedback: string | null
          created_at: string
          folder_id: string | null
          id: string
          language: string
          name: string
          page_range: string | null
          pdf_name: string | null
          questions: Json
          user_answers: Json | null
          user_id: string
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          language?: string
          name: string
          page_range?: string | null
          pdf_name?: string | null
          questions?: Json
          user_answers?: Json | null
          user_id: string
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          language?: string
          name?: string
          page_range?: string | null
          pdf_name?: string | null
          questions?: Json
          user_answers?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_saved_quizzes_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "pdf_quiz_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      productivity_logs: {
        Row: {
          actual_hours: number
          ai_score: number | null
          date: string
          id: string
          planned_hours: number
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_hours?: number
          ai_score?: number | null
          date?: string
          id?: string
          planned_hours?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_hours?: number
          ai_score?: number | null
          date?: string
          id?: string
          planned_hours?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      rbi_vocab_words: {
        Row: {
          created_at: string
          example: string | null
          hinglish_meaning: string | null
          id: string
          meaning: string
          root_meaning: string
          root_word: string
          serial_no: number
          word: string
        }
        Insert: {
          created_at?: string
          example?: string | null
          hinglish_meaning?: string | null
          id?: string
          meaning: string
          root_meaning: string
          root_word: string
          serial_no: number
          word: string
        }
        Update: {
          created_at?: string
          example?: string | null
          hinglish_meaning?: string | null
          id?: string
          meaning?: string
          root_meaning?: string
          root_word?: string
          serial_no?: number
          word?: string
        }
        Relationships: []
      }
      root_practice_attempts: {
        Row: {
          correct_index: number
          created_at: string
          id: string
          is_correct: boolean
          options: Json
          picked_index: number | null
          qtype: string | null
          question: string
          session_id: string
          user_id: string
          word_id: number | null
        }
        Insert: {
          correct_index: number
          created_at?: string
          id?: string
          is_correct?: boolean
          options: Json
          picked_index?: number | null
          qtype?: string | null
          question: string
          session_id: string
          user_id: string
          word_id?: number | null
        }
        Update: {
          correct_index?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          options?: Json
          picked_index?: number | null
          qtype?: string | null
          question?: string
          session_id?: string
          user_id?: string
          word_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "root_practice_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "root_practice_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "root_practice_attempts_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "ssc_root_words"
            referencedColumns: ["id"]
          },
        ]
      }
      root_practice_sessions: {
        Row: {
          correct: number
          created_at: string
          id: string
          total: number
          user_id: string
        }
        Insert: {
          correct?: number
          created_at?: string
          id?: string
          total?: number
          user_id: string
        }
        Update: {
          correct?: number
          created_at?: string
          id?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      ssc_black_book_items: {
        Row: {
          answer: string
          antonyms: string[] | null
          category: string
          created_at: string
          english_meaning: string | null
          example: string | null
          hindi_meaning: string | null
          hinglish_meaning: string | null
          hint: string | null
          id: string
          pos: string | null
          prompt: string
          serial_no: number | null
          subcategory: string | null
          synonyms: string[] | null
        }
        Insert: {
          answer: string
          antonyms?: string[] | null
          category: string
          created_at?: string
          english_meaning?: string | null
          example?: string | null
          hindi_meaning?: string | null
          hinglish_meaning?: string | null
          hint?: string | null
          id?: string
          pos?: string | null
          prompt: string
          serial_no?: number | null
          subcategory?: string | null
          synonyms?: string[] | null
        }
        Update: {
          answer?: string
          antonyms?: string[] | null
          category?: string
          created_at?: string
          english_meaning?: string | null
          example?: string | null
          hindi_meaning?: string | null
          hinglish_meaning?: string | null
          hint?: string | null
          id?: string
          pos?: string | null
          prompt?: string
          serial_no?: number | null
          subcategory?: string | null
          synonyms?: string[] | null
        }
        Relationships: []
      }
      ssc_bookmarks: {
        Row: {
          chapter: string
          correct_text: string | null
          created_at: string
          id: string
          item_ref: string | null
          kind: string
          meta: Json | null
          option_text: string | null
          question_text: string
          subcategory: string | null
          subject: string
          user_id: string
        }
        Insert: {
          chapter: string
          correct_text?: string | null
          created_at?: string
          id?: string
          item_ref?: string | null
          kind: string
          meta?: Json | null
          option_text?: string | null
          question_text: string
          subcategory?: string | null
          subject: string
          user_id: string
        }
        Update: {
          chapter?: string
          correct_text?: string | null
          created_at?: string
          id?: string
          item_ref?: string | null
          kind?: string
          meta?: Json | null
          option_text?: string | null
          question_text?: string
          subcategory?: string | null
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      ssc_chapter_questions: {
        Row: {
          chapter: string
          correct_option: string
          created_at: string
          exam_name: string | null
          explanation_hinglish: string | null
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          serial_no: number
          source: string | null
          subject: string
          subtopic: string
          updated_at: string
          why_a: string | null
          why_b: string | null
          why_c: string | null
          why_d: string | null
        }
        Insert: {
          chapter: string
          correct_option: string
          created_at?: string
          exam_name?: string | null
          explanation_hinglish?: string | null
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          serial_no: number
          source?: string | null
          subject: string
          subtopic?: string
          updated_at?: string
          why_a?: string | null
          why_b?: string | null
          why_c?: string | null
          why_d?: string | null
        }
        Update: {
          chapter?: string
          correct_option?: string
          created_at?: string
          exam_name?: string | null
          explanation_hinglish?: string | null
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question_text?: string
          serial_no?: number
          source?: string | null
          subject?: string
          subtopic?: string
          updated_at?: string
          why_a?: string | null
          why_b?: string | null
          why_c?: string | null
          why_d?: string | null
        }
        Relationships: []
      }
      ssc_chapter_theory: {
        Row: {
          chapter: string
          generated_at: string
          id: string
          question_count: number
          subject: string
          subtopic: string
          theory_md: string
          updated_at: string
        }
        Insert: {
          chapter: string
          generated_at?: string
          id?: string
          question_count?: number
          subject: string
          subtopic?: string
          theory_md: string
          updated_at?: string
        }
        Update: {
          chapter?: string
          generated_at?: string
          id?: string
          question_count?: number
          subject?: string
          subtopic?: string
          theory_md?: string
          updated_at?: string
        }
        Relationships: []
      }
      ssc_english_items: {
        Row: {
          book_solution: string | null
          category: string
          correct_answer: string | null
          correct_option: string
          corrected_sentence: string | null
          correction: string | null
          created_at: string
          error_word: string | null
          exam: string | null
          hint: string | null
          id: string
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          passage: string | null
          question_hinglish: string | null
          question_text: string
          serial_no: number
          set_no: number | null
          solution_hinglish: string | null
          topic: string | null
          updated_at: string
          usage_a: string | null
          usage_b: string | null
          usage_c: string | null
          usage_d: string | null
          why_a: string | null
          why_b: string | null
          why_c: string | null
          why_d: string | null
          word_meanings: string | null
        }
        Insert: {
          book_solution?: string | null
          category: string
          correct_answer?: string | null
          correct_option: string
          corrected_sentence?: string | null
          correction?: string | null
          created_at?: string
          error_word?: string | null
          exam?: string | null
          hint?: string | null
          id?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          passage?: string | null
          question_hinglish?: string | null
          question_text: string
          serial_no: number
          set_no?: number | null
          solution_hinglish?: string | null
          topic?: string | null
          updated_at?: string
          usage_a?: string | null
          usage_b?: string | null
          usage_c?: string | null
          usage_d?: string | null
          why_a?: string | null
          why_b?: string | null
          why_c?: string | null
          why_d?: string | null
          word_meanings?: string | null
        }
        Update: {
          book_solution?: string | null
          category?: string
          correct_answer?: string | null
          correct_option?: string
          corrected_sentence?: string | null
          correction?: string | null
          created_at?: string
          error_word?: string | null
          exam?: string | null
          hint?: string | null
          id?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          passage?: string | null
          question_hinglish?: string | null
          question_text?: string
          serial_no?: number
          set_no?: number | null
          solution_hinglish?: string | null
          topic?: string | null
          updated_at?: string
          usage_a?: string | null
          usage_b?: string | null
          usage_c?: string | null
          usage_d?: string | null
          why_a?: string | null
          why_b?: string | null
          why_c?: string | null
          why_d?: string | null
          word_meanings?: string | null
        }
        Relationships: []
      }
      ssc_grammar_rule_questions: {
        Row: {
          correct_answer_word: string | null
          correct_option: string
          created_at: string
          explanation_hinglish: string | null
          id: string
          q_order: number
          question_id: number
          question_text: string
          rule_id: number
          source: string | null
        }
        Insert: {
          correct_answer_word?: string | null
          correct_option: string
          created_at?: string
          explanation_hinglish?: string | null
          id?: string
          q_order?: number
          question_id: number
          question_text: string
          rule_id: number
          source?: string | null
        }
        Update: {
          correct_answer_word?: string | null
          correct_option?: string
          created_at?: string
          explanation_hinglish?: string | null
          id?: string
          q_order?: number
          question_id?: number
          question_text?: string
          rule_id?: number
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ssc_grammar_rule_questions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "ssc_grammar_rules"
            referencedColumns: ["rule_id"]
          },
        ]
      }
      ssc_grammar_rules: {
        Row: {
          created_at: string
          difficulty: string | null
          examples: string | null
          exception_note: string | null
          formula_short: string | null
          id: string
          rule_details: string | null
          rule_id: number
          rule_statement_hinglish: string | null
          rule_title: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          examples?: string | null
          exception_note?: string | null
          formula_short?: string | null
          id?: string
          rule_details?: string | null
          rule_id: number
          rule_statement_hinglish?: string | null
          rule_title: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          examples?: string | null
          exception_note?: string | null
          formula_short?: string | null
          id?: string
          rule_details?: string | null
          rule_id?: number
          rule_statement_hinglish?: string | null
          rule_title?: string
        }
        Relationships: []
      }
      ssc_pos_spot_error: {
        Row: {
          correct_form: string | null
          created_at: string
          error_in: string
          full_sentence: string
          hint: string | null
          id: string
          level: string
          part_a: string
          part_b: string
          part_c: string
          part_d: string
          pos: string
          practice: Json
          q_no: number
          rule_tag: string | null
          solution: string | null
          updated_at: string
        }
        Insert: {
          correct_form?: string | null
          created_at?: string
          error_in: string
          full_sentence: string
          hint?: string | null
          id?: string
          level: string
          part_a: string
          part_b: string
          part_c: string
          part_d: string
          pos: string
          practice?: Json
          q_no: number
          rule_tag?: string | null
          solution?: string | null
          updated_at?: string
        }
        Update: {
          correct_form?: string | null
          created_at?: string
          error_in?: string
          full_sentence?: string
          hint?: string | null
          id?: string
          level?: string
          part_a?: string
          part_b?: string
          part_c?: string
          part_d?: string
          pos?: string
          practice?: Json
          q_no?: number
          rule_tag?: string | null
          solution?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ssc_questions: {
        Row: {
          correct_option: number
          created_at: string | null
          difficulty: Database["public"]["Enums"]["ssc_difficulty"]
          exam: Database["public"]["Enums"]["ssc_exam"] | null
          explanation: string | null
          id: string
          is_pyq: boolean
          month: number | null
          options: Json
          question_text: string
          topic: Database["public"]["Enums"]["ssc_topic"]
          user_id: string | null
          year: number | null
        }
        Insert: {
          correct_option?: number
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["ssc_difficulty"]
          exam?: Database["public"]["Enums"]["ssc_exam"] | null
          explanation?: string | null
          id?: string
          is_pyq?: boolean
          month?: number | null
          options?: Json
          question_text: string
          topic: Database["public"]["Enums"]["ssc_topic"]
          user_id?: string | null
          year?: number | null
        }
        Update: {
          correct_option?: number
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["ssc_difficulty"]
          exam?: Database["public"]["Enums"]["ssc_exam"] | null
          explanation?: string | null
          id?: string
          is_pyq?: boolean
          month?: number | null
          options?: Json
          question_text?: string
          topic?: Database["public"]["Enums"]["ssc_topic"]
          user_id?: string | null
          year?: number | null
        }
        Relationships: []
      }
      ssc_root_words: {
        Row: {
          antonym: string | null
          created_at: string
          definition: string | null
          example: string | null
          hindi_meaning: string | null
          hinglish_meaning: string | null
          id: number
          root: string
          root_meaning: string | null
          root_plus_word: string | null
          sno: number | null
          synonym: string | null
          word: string
        }
        Insert: {
          antonym?: string | null
          created_at?: string
          definition?: string | null
          example?: string | null
          hindi_meaning?: string | null
          hinglish_meaning?: string | null
          id?: number
          root: string
          root_meaning?: string | null
          root_plus_word?: string | null
          sno?: number | null
          synonym?: string | null
          word: string
        }
        Update: {
          antonym?: string | null
          created_at?: string
          definition?: string | null
          example?: string | null
          hindi_meaning?: string | null
          hinglish_meaning?: string | null
          id?: number
          root?: string
          root_meaning?: string | null
          root_plus_word?: string | null
          sno?: number | null
          synonym?: string | null
          word?: string
        }
        Relationships: []
      }
      ssc_syn_ant_items: {
        Row: {
          antonym_example_sentence: string | null
          antonym_hinglish_meaning: string | null
          antonyms: string | null
          created_at: string
          example_sentence: string | null
          hinglish_meaning: string | null
          id: string
          kind: string
          meaning: string | null
          serial_no: number | null
          subcategory: string
          synonyms: string | null
          updated_at: string
          word: string
        }
        Insert: {
          antonym_example_sentence?: string | null
          antonym_hinglish_meaning?: string | null
          antonyms?: string | null
          created_at?: string
          example_sentence?: string | null
          hinglish_meaning?: string | null
          id?: string
          kind: string
          meaning?: string | null
          serial_no?: number | null
          subcategory: string
          synonyms?: string | null
          updated_at?: string
          word: string
        }
        Update: {
          antonym_example_sentence?: string | null
          antonym_hinglish_meaning?: string | null
          antonyms?: string | null
          created_at?: string
          example_sentence?: string | null
          hinglish_meaning?: string | null
          id?: string
          kind?: string
          meaning?: string | null
          serial_no?: number | null
          subcategory?: string
          synonyms?: string | null
          updated_at?: string
          word?: string
        }
        Relationships: []
      }
      ssc_user_progress: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          question_id: string
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ssc_user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "ssc_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      ssc_user_stats: {
        Row: {
          correct_count: number
          date: string
          id: string
          questions_solved: number
          streak_days: number
          user_id: string
          xp_points: number
        }
        Insert: {
          correct_count?: number
          date?: string
          id?: string
          questions_solved?: number
          streak_days?: number
          user_id: string
          xp_points?: number
        }
        Update: {
          correct_count?: number
          date?: string
          id?: string
          questions_solved?: number
          streak_days?: number
          user_id?: string
          xp_points?: number
        }
        Relationships: []
      }
      ssc_word_hindi: {
        Row: {
          created_at: string
          display: string
          hindi: string
          kind: string
          updated_at: string
          word_key: string
        }
        Insert: {
          created_at?: string
          display: string
          hindi: string
          kind?: string
          updated_at?: string
          word_key: string
        }
        Update: {
          created_at?: string
          display?: string
          hindi?: string
          kind?: string
          updated_at?: string
          word_key?: string
        }
        Relationships: []
      }
      sub_topics: {
        Row: {
          description: string | null
          id: string
          name: string
          order: number | null
          topic_id: string
          user_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          order?: number | null
          topic_id: string
          user_id: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          order?: number | null
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          exam_id: string
          id: string
          name: string
          order: number | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          exam_id: string
          id?: string
          name: string
          order?: number | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          exam_id?: string
          id?: string
          name?: string
          order?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          description: string | null
          id: string
          name: string
          order: number | null
          subject_id: string
          user_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          order?: number | null
          subject_id: string
          user_id: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          order?: number | null
          subject_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_content_edits: {
        Row: {
          created_at: string
          html: string
          id: string
          selector: string
          trainer_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          html: string
          id?: string
          selector: string
          trainer_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          html?: string
          id?: string
          selector?: string
          trainer_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      upsc_chapter_theory: {
        Row: {
          chapter_name: string
          chapter_no: number
          generated_at: string
          id: string
          question_count: number
          subject: string
          theory_md: string
          updated_at: string
        }
        Insert: {
          chapter_name: string
          chapter_no: number
          generated_at?: string
          id?: string
          question_count?: number
          subject: string
          theory_md: string
          updated_at?: string
        }
        Update: {
          chapter_name?: string
          chapter_no?: number
          generated_at?: string
          id?: string
          question_count?: number
          subject?: string
          theory_md?: string
          updated_at?: string
        }
        Relationships: []
      }
      upsc_questions: {
        Row: {
          chapter_name: string
          chapter_no: number
          correct_option: string
          created_at: string
          explanation_hinglish: string | null
          global_serial: number
          hint_hinglish: string | null
          id: string
          list_i: string | null
          list_ii: string | null
          ncert_extra: string | null
          ncert_source: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          q_type: string
          question_text: string
          serial_no: number
          statements: string | null
          subject: string
          topic_tag: string | null
          updated_at: string
          why_a: string | null
          why_b: string | null
          why_c: string | null
          why_d: string | null
        }
        Insert: {
          chapter_name: string
          chapter_no: number
          correct_option: string
          created_at?: string
          explanation_hinglish?: string | null
          global_serial: number
          hint_hinglish?: string | null
          id?: string
          list_i?: string | null
          list_ii?: string | null
          ncert_extra?: string | null
          ncert_source?: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          q_type?: string
          question_text: string
          serial_no: number
          statements?: string | null
          subject?: string
          topic_tag?: string | null
          updated_at?: string
          why_a?: string | null
          why_b?: string | null
          why_c?: string | null
          why_d?: string | null
        }
        Update: {
          chapter_name?: string
          chapter_no?: number
          correct_option?: string
          created_at?: string
          explanation_hinglish?: string | null
          global_serial?: number
          hint_hinglish?: string | null
          id?: string
          list_i?: string | null
          list_ii?: string | null
          ncert_extra?: string | null
          ncert_source?: string | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          q_type?: string
          question_text?: string
          serial_no?: number
          statements?: string | null
          subject?: string
          topic_tag?: string | null
          updated_at?: string
          why_a?: string | null
          why_b?: string | null
          why_c?: string | null
          why_d?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          channel_name: string | null
          duration: number | null
          id: string
          playlist_position: number | null
          source_id: string | null
          thumbnail_url: string | null
          title: string
          user_id: string
          youtube_id: string
        }
        Insert: {
          channel_name?: string | null
          duration?: number | null
          id?: string
          playlist_position?: number | null
          source_id?: string | null
          thumbnail_url?: string | null
          title: string
          user_id: string
          youtube_id: string
        }
        Update: {
          channel_name?: string | null
          duration?: number | null
          id?: string
          playlist_position?: number | null
          source_id?: string | null
          thumbnail_url?: string | null
          title?: string
          user_id?: string
          youtube_id?: string
        }
        Relationships: []
      }
      youtube_sources: {
        Row: {
          created_at: string | null
          id: string
          thumbnail_url: string | null
          title: string
          type: string
          user_id: string
          video_count: number | null
          youtube_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          type: string
          user_id: string
          video_count?: number | null
          youtube_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          type?: string
          user_id?: string
          video_count?: number | null
          youtube_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      bpsc_mains_paper: "gs1" | "gs2" | "essay" | "hindi"
      ssc_difficulty: "easy" | "medium" | "hard"
      ssc_exam: "CGL" | "CHSL" | "MTS" | "GD" | "BPSC" | "RBI"
      ssc_topic:
        | "idioms_phrases"
        | "one_word_substitution"
        | "synonyms_antonyms"
        | "error_detection"
        | "sentence_improvement"
        | "fill_in_blanks"
        | "cloze_test"
        | "reading_comprehension"
        | "active_passive"
        | "direct_indirect"
        | "parajumbles"
        | "spelling_correction"
        | "percentage"
        | "profit_loss"
        | "ratio_proportion"
        | "average"
        | "time_work"
        | "time_speed_distance"
        | "number_system"
        | "algebra"
        | "geometry"
        | "trigonometry"
        | "data_interpretation"
        | "simplification"
        | "analogy"
        | "coding_decoding"
        | "series"
        | "blood_relation"
        | "direction"
        | "syllogism"
        | "puzzle"
        | "venn_diagram"
        | "statement_conclusion"
        | "history"
        | "polity"
        | "geography"
        | "economy"
        | "static_gk"
        | "current_affairs"
        | "probability"
        | "permutation_combination"
        | "simple_compound_interest"
        | "seating_arrangement"
        | "pattern_recognition"
        | "sentence_correction"
        | "vocabulary"
        | "sentence_rearrangement"
        | "advanced_probability"
        | "perm_comb_puzzles"
        | "logical_mathematics"
        | "mixture_problems"
        | "data_sufficiency"
        | "seating_puzzles"
        | "multi_variable_logic"
        | "caselet_reasoning"
        | "pattern_deduction"
        | "indian_history"
        | "bihar_history"
        | "indian_polity"
        | "indian_economy"
        | "geography_india"
        | "geography_bihar"
        | "environment_ecology"
        | "general_science"
        | "current_affairs_bpsc"
        | "aptitude_bpsc"
        | "reasoning_bpsc"
        | "economic_social_issues"
        | "monetary_policy"
        | "fiscal_policy"
        | "banking_regulation"
        | "financial_markets"
        | "management_theory"
        | "esi"
        | "fm"
        | "english_p2"
        | "english"
        | "quant"
        | "reasoning"
        | "ga"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bpsc_mains_paper: ["gs1", "gs2", "essay", "hindi"],
      ssc_difficulty: ["easy", "medium", "hard"],
      ssc_exam: ["CGL", "CHSL", "MTS", "GD", "BPSC", "RBI"],
      ssc_topic: [
        "idioms_phrases",
        "one_word_substitution",
        "synonyms_antonyms",
        "error_detection",
        "sentence_improvement",
        "fill_in_blanks",
        "cloze_test",
        "reading_comprehension",
        "active_passive",
        "direct_indirect",
        "parajumbles",
        "spelling_correction",
        "percentage",
        "profit_loss",
        "ratio_proportion",
        "average",
        "time_work",
        "time_speed_distance",
        "number_system",
        "algebra",
        "geometry",
        "trigonometry",
        "data_interpretation",
        "simplification",
        "analogy",
        "coding_decoding",
        "series",
        "blood_relation",
        "direction",
        "syllogism",
        "puzzle",
        "venn_diagram",
        "statement_conclusion",
        "history",
        "polity",
        "geography",
        "economy",
        "static_gk",
        "current_affairs",
        "probability",
        "permutation_combination",
        "simple_compound_interest",
        "seating_arrangement",
        "pattern_recognition",
        "sentence_correction",
        "vocabulary",
        "sentence_rearrangement",
        "advanced_probability",
        "perm_comb_puzzles",
        "logical_mathematics",
        "mixture_problems",
        "data_sufficiency",
        "seating_puzzles",
        "multi_variable_logic",
        "caselet_reasoning",
        "pattern_deduction",
        "indian_history",
        "bihar_history",
        "indian_polity",
        "indian_economy",
        "geography_india",
        "geography_bihar",
        "environment_ecology",
        "general_science",
        "current_affairs_bpsc",
        "aptitude_bpsc",
        "reasoning_bpsc",
        "economic_social_issues",
        "monetary_policy",
        "fiscal_policy",
        "banking_regulation",
        "financial_markets",
        "management_theory",
        "esi",
        "fm",
        "english_p2",
        "english",
        "quant",
        "reasoning",
        "ga",
      ],
    },
  },
} as const
