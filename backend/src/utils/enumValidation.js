function isValidEnumValue(value, allowedValues) {
    return allowedValues.includes(value);
}

module.exports = {
    isValidEnumValue
};