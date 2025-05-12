fn main(
  age: u8, 
  min_age: pub u8, 
  aml_security: u8, 
  min_aml_security: pub u8,
  user_country_id: pub u32, 
  restricted_country_ids: pub [u32; 15],
  passport_is_valid: bool,
  passport_should_be_valid: bool,
) {
  assert(age >= min_age);
  assert(aml_security >= min_aml_security);

  // Check if user's country hash matches any restricted country hash
  let mut is_restricted = false;
  for i in 0..restricted_country_ids.len() {
    if user_country_id == restricted_country_ids[i] {
      is_restricted = true;
    }
  }
  assert(!is_restricted);

  assert(passport_is_valid == passport_should_be_valid);
}

#[test]
fn test_main() {
  main(
    20,
    18,
    1,
    1,
    0x123456789abcdef, // Example hash for an allowed country
    [
      0x111111111111111, 0x222222222222222, 0x333333333333333,
      0x444444444444444, 0x555555555555555, 0x666666666666666,
      0x777777777777777, 0x888888888888888, 0x999999999999999,
      0xaaaaaaaaaaaaaaa, 0xbbbbbbbbbbbbbbb, 0xccccccccccccccc,
      0xddddddddddddddd, 0xeeeeeeeeeeeeeee, 0xfffffffffffffff
    ],
    true,
    true
  );
}

#[test(should_fail)]
fn test_restricted_countries() {
  main(
    20,
    18,
    1,
    1,
    0x555555555555555, // Using a hash that matches a restricted country
    [
      0x111111111111111, 0x222222222222222, 0x333333333333333,
      0x444444444444444, 0x555555555555555, 0x666666666666666,
      0x777777777777777, 0x888888888888888, 0x999999999999999,
      0xaaaaaaaaaaaaaaa, 0xbbbbbbbbbbbbbbb, 0xccccccccccccccc,
      0xddddddddddddddd, 0xeeeeeeeeeeeeeee, 0xfffffffffffffff
    ],
    true,
    true
  );
}