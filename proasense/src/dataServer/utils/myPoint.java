package dataServer.utils;


public class myPoint {

	/**
	 * 
	 */
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 1L;
	

	private double x;
	private double y;
	
	public myPoint(double x, double y){
		this.x = x;
		this.y = y;
	}
	
	public double getX() {
		return x;
	}
	public void setX(double doublX) {
		this.x = doublX;
	}
	
	public double getY() {
		return y;
	}
	public void setY(double doublY) {
		this.y = doublY;
	}
	
}
