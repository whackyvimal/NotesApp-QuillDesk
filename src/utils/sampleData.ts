import { Note } from "@/types/note";
import { generateNoteId } from "./localStorage";

export const createSampleNotes = (): Note[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return [
    {
      id: generateNoteId(),
      title: "Welcome to Notes App! 🎉",
      content: "This is your first note! You can create, edit, pin, archive, and organize your notes with tags. Try out all the features to see how powerful this notes app can be for organizing your thoughts and ideas.",
      tags: ["welcome", "tutorial"],
      status: "pinned",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateNoteId(),
      title: "Project Ideas",
      content: "Here are some exciting project ideas I want to work on:\n\n1. A personal blog with markdown support\n2. A task management app with team collaboration\n3. A recipe organizer with ingredient tracking\n4. A book reading tracker with reviews\n\nEach project could use different tech stacks and would be great learning experiences!",
      tags: ["projects", "ideas", "development"],
      status: "active",
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: generateNoteId(),
      title: "Meeting Notes - Q4 Planning",
      content: "Key discussion points from today's quarterly planning meeting:\n\n• Revenue targets for Q4\n• New product feature roadmap\n• Team expansion plans\n• Marketing strategy updates\n\nAction items:\n- Finalize budget proposals by Friday\n- Schedule follow-up with design team\n- Prepare presentation for stakeholders",
      tags: ["work", "meetings", "planning"],
      status: "active",
      createdAt: lastWeek,
      updatedAt: lastWeek,
    },
    {
      id: generateNoteId(),
      title: "Learning Resources",
      content: "Bookmarked resources for continued learning:\n\n📚 Books:\n- Clean Code by Robert Martin\n- Design Patterns by Gang of Four\n- The Pragmatic Programmer\n\n🎥 Courses:\n- Advanced React Patterns\n- System Design Fundamentals\n- Database Optimization\n\n📝 Articles:\n- Best practices for state management\n- Performance optimization techniques",
      tags: ["learning", "resources", "books", "courses"],
      status: "archived",
      createdAt: lastWeek,
      updatedAt: lastWeek,
    },
    {
      id: generateNoteId(),
      title: "Travel Checklist",
      content: "Things to pack for upcoming vacation:\n\n✈️ Documents:\n- Passport\n- Travel insurance\n- Hotel confirmations\n- Flight tickets\n\n🎒 Essentials:\n- Phone charger\n- Camera\n- Medications\n- Comfortable shoes\n\n🏖️ Beach items:\n- Sunscreen\n- Swimwear\n- Beach towel\n- Sunglasses",
      tags: ["travel", "vacation", "checklist"],
      status: "active",
      createdAt: yesterday,
      updatedAt: now,
    },
  ];
};