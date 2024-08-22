import Float "mo:base/Float";

actor Calculator {
  // Addition function
  public func add(x : Float, y : Float) : async Float {
    return x + y;
  };

  // Subtraction function
  public func subtract(x : Float, y : Float) : async Float {
    return x - y;
  };

  // Multiplication function
  public func multiply(x : Float, y : Float) : async Float {
    return x * y;
  };

  // Division function
  public func divide(x : Float, y : Float) : async ?Float {
    if (y == 0) {
      return null; // Return null for division by zero
    } else {
      return ?(x / y);
    };
  };
}