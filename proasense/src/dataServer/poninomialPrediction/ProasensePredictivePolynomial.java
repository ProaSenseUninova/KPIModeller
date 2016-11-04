package dataServer.poninomialPrediction;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apache.commons.math3.fitting.PolynomialCurveFitter;
import org.apache.commons.math3.fitting.WeightedObservedPoints;
import org.apache.commons.math3.fitting.leastsquares.LeastSquaresProblem;

import com.google.common.collect.ImmutableMap;

import dataServer.utils.RegressionResult;
import dataServer.utils.RegressionResults;
import dataServer.utils.myDataset;
import dataServer.utils.myDatasets;
import dataServer.utils.myPoint;

public class ProasensePredictivePolynomial implements IProasensePredictiveAlgorithm {

	private final Map<Integer, String> granularityMap = ImmutableMap.<Integer, String> builder().put(4, "hour")
			.put(3, "day").put(2, "week").put(1, "month").build();

	private static double predictionTimeFrameFactor = 0.3;
	private final PolynomialCurveFitter fitter = PolynomialCurveFitter.create(2);

	public RegressionResults generatePrediction(myDatasets datasets) {
		// TODO Auto-generated method stub
		int predictionTimeFrame = this.getPredictionTimeFrame(datasets.getTimeFrameSize());
		RegressionResults results = new RegressionResults();
		for (myDataset dataset : datasets.getDatasets()) {
			WeightedObservedPoints chart_points = new WeightedObservedPoints();
			for (myPoint point : dataset.getPoints()) {
				chart_points.add(point.getX(), point.getY());
			}
			// y = coeff2*x^2 + coeff1*x + coeff0
			double[] coeff = this.fitter.fit(chart_points.toList());
			results.getRegressionResults().add(this.generatePredictions(coeff, dataset.getPoints()[dataset.getPoints().length - 1].getX(),
					datasets.getGranularity(), predictionTimeFrame));
		}

		return results;
	}

	private int getPredictionTimeFrame(final int datasetSize) {
		return (int) (datasetSize * predictionTimeFrameFactor);
	}

	private RegressionResult generatePredictions(double[] coeff, double startingXPoint, int granularity,
			int predictionTimeFrame) {
		double[] independentVariables = new double[predictionTimeFrame];
		double[] predictions = new double[predictionTimeFrame];
		RegressionResult result = new RegressionResult(coeff, granularity, independentVariables, predictions);
		for (int index_x = 0; index_x < predictionTimeFrame; index_x++) {
			startingXPoint = this.calculateNextXPoint(granularity, startingXPoint);
			//System.out.println(startingXPoint);
			double predictedYPoint = this.applyModel(startingXPoint, coeff);
			//System.out.println(predictedYPoint);
			result.getIndependentVariables()[index_x] = startingXPoint;
			result.getPredictions()[index_x] = predictedYPoint;
		}

		return result;
	}

	private double calculateNextXPoint(int granularity, double startingXPoint) {
		double nextXPoint = 0.0;
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis((long) startingXPoint);
		if (this.granularityMap.get(granularity).equals("hour")) {
			calendar.add(Calendar.HOUR_OF_DAY, 1);
			return calendar.getTimeInMillis();
		} else if (this.granularityMap.get(granularity).equals("day")) {
			calendar.add(Calendar.DAY_OF_YEAR, 1);
			return calendar.getTimeInMillis();
		} else if (this.granularityMap.get(granularity).equals("week")) {
			calendar.add(Calendar.WEEK_OF_YEAR, 1);
			return calendar.getTimeInMillis();
		} else if (this.granularityMap.get(granularity).equals("month")) {
			calendar.add(Calendar.MONTH, 1);
			return calendar.getTimeInMillis();
		}
		return nextXPoint;
	}

	private double applyModel(double x, double[] coeff) {
		double y = coeff[2] * (x * x) + coeff[1] * x + coeff[0];
		return y;
	}
}
