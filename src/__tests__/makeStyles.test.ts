import { createStyles, makeStyles } from '../makeStyles';

describe('makeStyles utilities', () => {
  describe('createStyles', () => {
    it('should return styles object as-is', () => {
      const styles = {
        root: { padding: 10 },
        title: { fontSize: 20 },
      };

      const result = createStyles(styles);

      expect(result).toEqual(styles);
      expect(result).toBe(styles); // Should be same reference
    });

    it('should preserve complex style objects', () => {
      const styles = {
        container: {
          display: 'flex',
          flexDirection: 'column' as const,
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        },
      };

      const result = createStyles(styles);

      expect(result).toEqual(styles);
    });
  });

  describe('makeStyles', () => {
    it('should be a function', () => {
      expect(typeof makeStyles).toBe('function');
    });

    it('should return a function when called', () => {
      const useStyles = makeStyles()(() => ({
        root: { padding: 10 },
      }));

      expect(typeof useStyles).toBe('function');
    });
  });
});
