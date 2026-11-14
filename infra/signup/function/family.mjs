const present = (value) => typeof value === "string" && Boolean(value.trim());
const count = (value) => /^\d{1,3}$/.test(String(value));
const day = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().startsWith(value);
export const roomKey = (value) => value.trim().toUpperCase();
export function missing(family) {
  const errors = [];
  const { children, rooms } = family;
  if (
    !present(family.name) ||
    !present(family.locality) ||
    (family.locality === "Other" && !present(family.other))
  )
    errors.push("Enter the primary contact and locality.");
  const counts = [family.adults, family.youth, family.kids];
  if (
    !counts.every(count) ||
    !counts.some(Number) ||
    Number(family.kids) < children.length
  )
    errors.push(
      "Check household headcounts, including children using childcare.",
    );
  if (children.length && !present(family.mobile))
    errors.push("Enter a guardian mobile number.");
  for (const [name, phone] of [
    ["guardian", "guardianPhone"],
    ["pickup", "pickupPhone"],
  ]) {
    if (Boolean(family[name]) !== Boolean(family[phone]))
      errors.push("Enter both name and phone for each additional contact.");
  }
  for (const [i, c] of children.entries()) {
    if (
      ![c.first, c.last].every(present) ||
      !["Boy", "Girl"].includes(c.gender) ||
      !count(c.age) ||
      +c.age < 5 ||
      +c.age > 12 ||
      !["K", "1", "2", "3", "4", "5", "6"].includes(c.grade) ||
      !Array.isArray(c.meetings) ||
      !c.meetings.length ||
      !c.meetings.every((m) => ["satAM", "satPM", "sunAM"].includes(m))
    )
      errors.push(
        "Complete the details and meetings for child " + (i + 1) + ".",
      );
  }
  if (
    !rooms.length ||
    !rooms.some(
      (r) =>
        day(r.arrival) &&
        day(r.departure) &&
        r.arrival < "2027-01-17" &&
        r.departure > "2027-01-15" &&
        r.arrival < r.departure,
    )
  )
    errors.push("Add a Hilton reservation covering January 15 or 16.");
  if (
    rooms.some(
      (r) =>
        !present(r.guest) ||
        !present(r.number) ||
        !day(r.arrival) ||
        !day(r.departure) ||
        r.departure <= r.arrival,
    )
  )
    errors.push("Complete each hotel reservation.");
  if (family.tripCity) {
    const adults = Number(family.tripAdults);
    const children = Number(family.tripChildren);
    if (!["Wilmington", "Charleston"].includes(family.tripCity) ||
        !count(family.tripAdults) || !count(family.tripChildren) ||
        adults + children < 1 || adults > Number(family.adults) ||
        children > Number(family.kids) + Number(family.youth)) {
      errors.push("Choose one gospel trip and enter adult and child counts within your registration totals.");
    }
  } else if (Number(family.tripAdults || 0) || Number(family.tripChildren || 0)) {
    errors.push("Choose a gospel trip for the participants listed.");
  }
  return errors;
}
