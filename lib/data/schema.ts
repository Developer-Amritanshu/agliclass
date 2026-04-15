export const schemaOverview = {
  schools: ["id", "name", "slug", "board", "city", "district", "category", "medium", "logo_url", "cover_image_url"],
  classes: ["id", "school_id", "grade", "section", "academic_year", "active_syllabus_version_id"],
  master_book_catalog: ["id", "work_key", "isbn13", "title", "subject", "publisher", "language", "cover_image_url"],
  book_editions: ["id", "book_id", "edition_label", "publication_year", "cover_hash", "page_count"],
  syllabus_versions: ["id", "school_id", "class_id", "academic_year", "version_label", "status", "verified_by"],
  syllabus_mapper: ["id", "syllabus_version_id", "slot_no", "subject", "is_mandatory", "accepted_book_id", "accepted_edition_id", "confidence_score"],
  seller_submissions: ["id", "user_id", "school_id", "class_id", "pickup_mode", "status"],
  inventory: ["id", "submission_item_id", "book_id", "edition_id", "grade", "qc_status", "refurb_status", "status"],
  kit_bundles: ["id", "syllabus_version_id", "completion_pct", "quality_band", "price", "hero_badge", "status"],
  orders: ["id", "buyer_user_id", "school_id", "class_id", "syllabus_version_id", "kit_bundle_id", "payment_status", "fulfillment_status", "total_amount"],
  tasks: ["id", "task_type", "entity_type", "entity_id", "assigned_to", "status", "scheduled_for"],
};
