/* eslint-disable */
export default {
  "id": "position",
  "type": "object",
  "properties": {
    "latShift": {
      "type": "number",
      "minimum": -0.01,
      "maximum": 0.01
    },
    "lonShift": {
      "type": "number",
      "minimum": -0.015,
      "maximum": 0.015
    }
  },
  "required": ["latShift", "lonShift"]
}