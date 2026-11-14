import test from "node:test";
import assert from "node:assert/strict";
import { missing } from "../infra/signup/function/family.mjs";
const family = {
  name: "Parent",
  locality: "Charlotte",
  adults: "1",
  youth: "0",
  kids: "1",
  children: [],
  rooms: [
    {
      guest: "Parent",
      number: "123",
      arrival: "2027-01-16",
      departure: "2027-01-17",
    },
  ],
};
test("family can complete without childcare; either conference night qualifies", () =>
  assert.deepEqual(missing(family), []));
test("removing the room returns the family to incomplete", () =>
  assert.ok(missing({ ...family, rooms: [] }).length));
test("kindergarten childcare uses household guardian", () =>
  assert.deepEqual(
    missing({
      ...family,
      mobile: "5551234567",
      children: [
        {
          first: "A",
          last: "B",
          gender: "Girl",
          age: "5",
          grade: "K",
          meetings: ["satAM"],
        },
      ],
    }),
    [],
  ));
test("one gospel trip accepts adult-only and mixed groups within attendance totals",()=>{
  const trip={...family,tripCity:"Wilmington",tripAdults:"1",tripChildren:"0"};
  assert.deepEqual(missing(trip),[]);
  assert.deepEqual(missing({...trip,tripCity:"Charleston",tripChildren:"1"}),[]);
  for(const edit of [{tripChildren:"2"},{tripCity:"Both"},{tripAdults:"0"},{tripCity:""}])
    assert.ok(missing({...trip,...edit}).length);
});
