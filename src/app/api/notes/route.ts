import { searchNotes, addNote, getAllNotes, initDb, updateNote, deleteNote } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const action = searchParams.get("action");

  try {
    if (action === "init") {
      await initDb();
      return NextResponse.json({ message: "DB initialized" });
    }

    if (query) {
      const notes = await searchNotes(query);
      return NextResponse.json({ notes });
    } else {
      const notes = await getAllNotes();
      return NextResponse.json({ notes });
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, category } = await request.json();
    await addNote(title, content, category);
    return NextResponse.json({ message: "Note added" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const { title, content, category } = await request.json();
    await updateNote(Number(id), title, content, category);
    return NextResponse.json({ message: "Note updated" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    await deleteNote(Number(id));
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}