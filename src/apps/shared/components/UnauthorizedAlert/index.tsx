import React from 'react'
import { CircleAlertIcon } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/core-components/alert'

type UnauthorizedAlertProps = {
	title?: string
	description?: string
}

const UnauthorizedAlert: React.FC<UnauthorizedAlertProps> = ({
	title = 'Unauthorized',
	description = 'You do not have permission to view this resource.',
}) => {
	return (
		<div className="" style={{width: '500px', margin: '50px auto'}} data-testid="unauthorized-alert">
			<div className="w-full max-w-md">
				<Alert variant="destructive">
					<CircleAlertIcon className="mr-2 h-5 w-5" />
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription>{description}</AlertDescription>
				</Alert>
			</div>
		</div>
	)
}

export default UnauthorizedAlert
