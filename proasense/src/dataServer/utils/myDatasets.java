package dataServer.utils;

public class myDatasets {
	
	/**
	 * 
	 */
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 1L;
	
	private int granularity;
	private int timeFrameSize;
	private myDataset[] datasets;
	
	public myDatasets(int granularity, int timeFrameSize, myDataset [] datasets) {
		this.granularity = granularity;
		this.setTimeFrameSize(timeFrameSize);
		this.setDatasets(datasets);
	}

	public myDataset[] getDatasets() {
		return datasets;
	}

	public void setDatasets(myDataset[] datasets) {
		this.datasets = datasets;
	}

	public int getGranularity() {
		return granularity;
	}

	public void setGranularity(int granularity) {
		this.granularity = granularity;
	}

	public int getTimeFrameSize() {
		return timeFrameSize;
	}

	public void setTimeFrameSize(int timeFrameSize) {
		this.timeFrameSize = timeFrameSize;
	}
	
}
