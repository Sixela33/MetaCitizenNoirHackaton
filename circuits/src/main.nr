fn main(
  age: u8, 
  min_age: pub u8, 
  aml_security: u8, 
  min_aml_security: pub u8,
  user_country: u32, 
  restricted_countries: pub [u32; 15],
  passport_is_valid: bool,
  passport_should_be_valid: bool,
) {
  assert(age >= min_age);
  assert(aml_security >= min_aml_security);

  for i in 0..restricted_countries.len() {
    assert(user_country != restricted_countries[i]);
  }

  assert(passport_is_valid == passport_should_be_valid);
}

#[test]
fn test_main() {
  main(
    20,
      18,
      1,
    1,
    16,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
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
    5,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    true,
    false
  );
}