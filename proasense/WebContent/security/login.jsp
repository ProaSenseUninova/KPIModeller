<%--
 Licensed to the Apache Software Foundation (ASF) under one or more
  contributor license agreements.  See the NOTICE file distributed with
  this work for additional information regarding copyright ownership.
  The ASF licenses this file to You under the Apache License, Version 2.0
  (the "License"); you may not use this file except in compliance with
  the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
--%>
<html>
<head>
	<title>Proasense Login Page</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="css/login.css">
	<link rel="stylesheet" type="text/css" href="lib/bootstrap-3.3.6/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<script src="lib/bootstrap-3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
	<div id="login-page">
		<div class="jumbotron text-center" >
			<div style="background-image: url(images/logotype_colour-cmyk-300x55.png);"> </div>
<!-- 			<img alt="" src="images/logotype_colour-cmyk-300x55.png" /><br /> -->
			<form id="loginform" method="POST" action='<%= response.encodeURL("j_security_check") %>' >
<!-- 			  <table border="0" cellspacing="5"> -->
<!-- 			    <tr> -->
<!-- 			      <th align="right">Username:</th> -->
<!-- 			      <td align="left"><input type="text" name="j_username"></td> -->
<!-- 			    </tr> -->
<!-- 			    <tr> -->
<!-- 			      <th align="right">Password:</th> -->
<!-- 			      <td align="left"><input type="password" name="j_password"></td> -->
<!-- 			    </tr> -->
<!-- 			    <tr> -->
<!-- 			      <td align="right"><input type="submit" value="Log In"></td> -->
<!-- 			      <td align="left"><input type="reset"></td> -->
<!-- 			    </tr> -->
<!-- 			  </table> -->
				   	<input type="text" class="form-control text_boxes" name="j_username" placeholder="&lt;username&gt;" required />
				   	<input type="password" class="form-control text_boxes" name="j_password" placeholder="&lt;password&gt;" required />
				   	<button type="submit" class="btn btn-danger text_boxes" >Login</button>
			</form>
		</div>
	</div>
</body>
</html>