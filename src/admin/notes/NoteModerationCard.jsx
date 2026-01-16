import { approveNote, rejectNote } from "../../services/adminNotes.service";

export default function NoteModerationCard({ note }) {
  return (
    <div>
      <h4>{note.title}</h4>
      <button onClick={() => approveNote(note.id)}>Approve</button>
      <button onClick={() => rejectNote(note.id, "Low quality")}>Reject</button>
    </div>
  );
}
