import core "core"
import Math "math"

id = toBase(Math.trunc(Math.random() * 10000), 16)
print("U+{id}")

func joinReverse(arr):
	str = ""
	for (arr.len()-1)..(-1) each i:
		str = str.concat(arr[i])
	return str

func toBase(num, radix):
	keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
	if (radix < 2 or radix > keys.len()):
		panic(#invalid_radix)

	isNegative = false
	if (num < 0):
		isNegative = true
	
	if (Math.isNaN(num)):
		return nan
	
	num = Math.abs(num)

	output = []

	while (num != 0):
		index = num % radix
		output.append(keys[index])
		num = Math.trunc(num / radix)

	if (isNegative):
		output.append('-')
	
	return joinReverse(output)
