package dataServer.utils;

public class myDataset {
	
	/**
	 * 
	 */
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 1L;
	
	private myPoint [] points;
	
	public myDataset(myPoint[] points){
		this.points = points;
	}

	public myPoint [] getPoints() {
		return points;
	}

	public void setPoints(myPoint [] points) {
		this.points = points;
	}

}
