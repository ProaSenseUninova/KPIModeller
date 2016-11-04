<!DOCTYPE html>
<html>
	<head>
		<script>
			function f() {
				if(document.getElementById('uid').value.length==0)
					alert("UserId can't be blank");
				else if(document.getElementById('pwd').value.length==0)
					alert("Password can't be blank");
				else {
					alert("successfully logged in");
					window.open("Welcome.html");
				}
			}
		</script>
	</head>

	<body>
	<div id="loginpage2">
		UserId : <input type="text" id="uid"><br/>
		Passowrd: <input type="text" id="pwd"><br /><br/>
		<input type ="button" onclick="f()" value ="LogIn">
		</div>
		
<div id="loginpage">
	<form name="login" action="index_submit" method="post" accept-charset="utf-8">
	    <ul>
	        <li>
	        	<label for="username">Username</label>
	        	<input type="text" name="username" placeholder="&lt;username&gt;" required>
	        </li>
	        <li>
	        	<label for="password">Password</label>
	        	<input type="password" name="password" placeholder="&lt;password&gt;" required>
	        </li>
	        <li>
	        	<input type="submit" value="Login" onclick="">
	        </li>
	    </ul>
	</form>
</div>
		
	</body>
</html>