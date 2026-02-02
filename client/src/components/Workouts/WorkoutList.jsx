import WorkoutItem from "./WorkoutItem.jsx";

const WorkoutList = ({ workouts }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {workouts &&
        workouts.map((workout) => (
          <WorkoutItem key={workout._id} workout={workout} />
        ))}
    </div>
  );
};

export default WorkoutList;
