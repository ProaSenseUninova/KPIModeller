package dataServer.poninomialPrediction;

import dataServer.utils.RegressionResults;
import dataServer.utils.myDatasets;

public interface IProasensePredictiveAlgorithm {

	public RegressionResults generatePrediction(myDatasets datasets);
	
}
