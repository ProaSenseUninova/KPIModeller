package dataServer.utils;

public class RegressionResult {
	
	private double [] coeff;
	private int granularity;
	private double [] independentVariables;
	private double [] predictions;
	
	
	public RegressionResult(double[] coeff, int granularity, double[] independentVariables, double[] predictions) {
		this.coeff = coeff;
		this.granularity = granularity;
		this.independentVariables = independentVariables;
		this.predictions = predictions;
	}

	public double[] getCoeff() {
		return coeff;
	}

	public void setCoeff(double[] coeff) {
		this.coeff = coeff;
	}

	public int getGranularity() {
		return granularity;
	}

	public void setGranularity(int granularity) {
		this.granularity = granularity;
	}

	public double[] getIndependentVariables() {
		return independentVariables;
	}

	public void setIndependentVariables(double[] independentVariables) {
		this.independentVariables = independentVariables;
	}

	public double[] getPredictions() {
		return predictions;
	}

	public void setPredictions(double[] predictions) {
		this.predictions = predictions;
	}
	
}
