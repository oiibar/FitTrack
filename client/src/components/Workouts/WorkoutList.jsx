import Workout from "./Workout.jsx";

const WorkoutList = ({ workouts }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {workouts &&
        workouts.map((workout) => (
          <Workout key={workout._id} workout={workout} />
        ))}
    </div>
  );
};

export default WorkoutList;
