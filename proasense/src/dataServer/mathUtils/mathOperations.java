package dataServer.mathUtils;

public class mathOperations {
//	String termA;
//	String termB;
//	String operator;
	
	
	public mathOperations(){}
	
	public double getResult(String operandA, String operandB, String operator) {
		double result = 0.0;
		switch (operator) {
		case "+": result = getAddition(operandA, operandB);
			break;
		case "-": result = getDifference(operandA, operandB);
			break;
		case "*": result = getProduct(operandA, operandB);
			break;
		case "/": result = getQuocient(operandA, operandB);
			break;
		default: result = 0.0;
			break;
		}
		return result;
	}
	
	private double getQuocient(String termA, String termB){
		return Double.parseDouble(termA)/Double.parseDouble(termB);
//		return Integer.parseInt(termA)/Integer.parseInt(termB);
	}

	private double getProduct(String termA, String termB){
		return Integer.parseInt(termA)*Integer.parseInt(termB);
	}
	
	private double getDifference(String termA, String termB){
		return Integer.parseInt(termA)-Integer.parseInt(termB);
	}
	
	private double getAddition(String termA, String termB){
		return Integer.parseInt(termA)+Integer.parseInt(termB);
	}
}
