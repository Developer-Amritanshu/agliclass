insert into schools (id, name, slug, board, city, district, category, medium, cover_image_url)
values
  ('sgrr-dehradun', 'SGRR Public School', 'sgrr-public-school-dehradun', 'CBSE', 'Dehradun', 'Dehradun', 'private', 'English', '/images/school-ridge.svg'),
  ('ggic-haldwani', 'GGIC Haldwani', 'ggic-haldwani', 'UK Board', 'Haldwani', 'Nainital', 'government', 'Hindi / English', '/images/school-valley.svg'),
  ('saint-joseph', 'St. Joseph''s Academy', 'st-joseph-academy-dehradun', 'ICSE', 'Dehradun', 'Dehradun', 'private', 'English', '/images/school-forest.svg')
on conflict (id) do nothing;

insert into kit_bundles (id, school_name, class_label, academic_year, completion_pct, quality_band, savings_pct, used_item_count, new_item_count, total_books, price, retail_price, hero_badge, status)
values
  ('kit-sgrr-7-2026', 'SGRR Public School', 'Class 7', '2026-27', 92, 'A+', 41, 8, 1, 9, 1490, 2525, 'Top parent pick this week', 'verified'),
  ('kit-ggic-6-2026', 'GGIC Haldwani', 'Class 6', '2026-27', 74, 'Mixed', 35, 5, 1, 8, 890, 1360, 'Budget-friendly starter kit', 'partial'),
  ('kit-joseph-5-2026', 'St. Joseph''s Academy', 'Class 5', '2026-27', 100, 'A', 38, 7, 0, 7, 1980, 3190, 'Fully verified and dispatch-ready', 'verified')
on conflict (id) do nothing;
