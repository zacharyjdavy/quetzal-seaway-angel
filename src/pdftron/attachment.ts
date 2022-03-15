export interface Attachment {
  cascade_deleted_by_id: UserId;
  created_at: Timestamp;
  creator_user_id: UserId;
  deleted_at: Timestamp;
  device_created_at: Timestamp;
  device_updated_at: Timestamp;
  file_size: number;
  file_url: string;
  floorplans_count: number;
  id: Id;
  is_dynamic: boolean;
  kind: 'file' | 'photo' | 'video' | 'photo_sphere' | 'sign';
  last_editor_user_id: UserId;
  latitude: number;
  longitude: number;
  name: string;
  original_url: string;
  process_state: 'deleting' | 'restoring';
  project_id: Id;
  resolved_conflict: boolean;
  thumb_url: string;
  updated_at: Timestamp;
}
