export default date => {
    var options = {
        dateStyle: "long"
    };
    return new Date(date).toLocaleString("lt-LT", options);
}